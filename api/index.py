from pytube import YouTube, request, Playlist
from urllib.error import HTTPError
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from io import BytesIO
import base64 as encryptor
from json import dumps
from unidecode import unidecode


app = FastAPI()

@app.get("/api/getVideoInfo/{VideoLink}", status_code = 200)
async def getVideoInfo(VideoLink:str, fromAPI:bool=True):
  decoded = ""
  if fromAPI:
    decoded = str(encryptor.b32decode(VideoLink))
  else:
    decoded = VideoLink
  video_url = YouTube(decoded)
  return {"thumbnail": video_url.thumbnail_url, "length": video_url.length, "title": unidecode(video_url.title), "link": decoded}

@app.get("/api/downloadVideo/{VideoLink}", status_code = 200)
async def downloadVideo(VideoLink:str):
  decoded = str(encryptor.b32decode(VideoLink))
  video_url = YouTube(decoded)
  video = video_url.streams.get_highest_resolution()
  async def stream_video():
        bytes_remaining = video.filesize
        try:
            for chunk in request.stream(video.url, timeout=None, max_retries=0):
                bytes_remaining -= len(chunk)
                yield encryptor.b64encode(chunk)
        except HTTPError as e:
            if e.code != 404:
                raise
            # Some adaptive streams need to be requested with sequence numbers
            for chunk in request.seq_stream(video.url):
                bytes_remaining -= len(chunk)
                yield encryptor.b64encode(chunk)
  return StreamingResponse(stream_video())

@app.get("/api/getPlaylistTitle/{PlaylistLink}", status_code = 200)
async def getPlaylistTitle(PlaylistLink:str):
  decoded = str(encryptor.b32decode(PlaylistLink).decode('utf-8'))
  playlist = Playlist(decoded)
  return {"title":playlist.title}

@app.get("/api/getPlaylistInfo/{PlaylistLink}", status_code = 200)
async def getPlaylistInfo(PlaylistLink:str):
  #print("Request received", file=sys.stderr)
  decoded = str(encryptor.b32decode(PlaylistLink).decode('utf-8'))
  #print("Request decoded", file=sys.stderr)
  playlist = Playlist(decoded)
  video_urls = list(playlist.video_urls.gen)
  #print(f"Is list Empty? {not video_urls}", file=sys.stderr)
    
  async def stream_Playlist():
    for video_url in video_urls:
      info_video = await getVideoInfo(video_url, fromAPI=False)
      #print(f"video info {index} appended", file=sys.stderr)
      yield dumps(info_video).encode('utf-8') + b"\n"
  return StreamingResponse(stream_Playlist())
