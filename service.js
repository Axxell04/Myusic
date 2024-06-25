import TrackPlayer, {Event} from "react-native-track-player";

module.exports = async function () {
  TrackPlayer.addEventListener("remote-play", () => TrackPlayer.play());
  TrackPlayer.addEventListener("remote-pause", () => TrackPlayer.pause());
  TrackPlayer.addEventListener("remote-next", () => TrackPlayer.skipToNext());
  TrackPlayer.addEventListener("remote-previous", () => TrackPlayer.skipToPrevious());
  TrackPlayer.addEventListener(Event.RemoteSeek, (e) => TrackPlayer.seekTo(e.position))
  TrackPlayer.addEventListener(Event.RemoteDuck, e => e.paused ? TrackPlayer.pause() : null);
};
