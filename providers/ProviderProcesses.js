import { createContext, useContext, useEffect, useState } from "react";
import { ManagerWSContext } from "./ProviderConnection";
import { Player } from "../class/Player";

export const DownloadInProcessContext = createContext(null);

//SYNC/DESYNC MUSICS
export const ChangesInProcessContext = createContext(null);

export const PlayingMusicContext = createContext(null);
export const MusicPlayingContext = createContext(null);
export const PlayerContext = createContext(new Player());
export const MusicDurationContext = createContext(null);
export const MusicPositionContext = createContext(null);

export function ProviderProcesses({ children }) {
  const [downloadInProcess, setDownloadInProcess] = useState(false);
  const [changesInProcess, setChangesInProcess] = useState(false);

  const [player, setPlayer] = useState(new Player());
  const [playingMusic, setPlayingMusic] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState({ id: 38 });
  const [musicDuration, setMusicDuration] = useState(0);
  const [musicPosition, setMusicPosition] = useState(0);
  const managerWS = useContext(ManagerWSContext);
  managerWS.setSetterDownloadInProcess(setDownloadInProcess);

  player.setSetterPlayingMusic(setPlayingMusic);
  player.setSetterMusicDuration(setMusicDuration);
  player.setSetterMusicPosition(setMusicPosition);

  return (
    <DownloadInProcessContext.Provider
      value={{ downloadInProcess, setDownloadInProcess }}
    >
      <ChangesInProcessContext.Provider value={{ changesInProcess, setChangesInProcess }}>
        <PlayerContext.Provider value={player}>
          <PlayingMusicContext.Provider
            value={{ playingMusic, setPlayingMusic }}
          >
            <MusicPlayingContext.Provider
              value={{ musicPlaying, setMusicPlaying }}
            >
              <MusicDurationContext.Provider
                value={{ musicDuration, setMusicDuration }}
              >
                <MusicPositionContext.Provider
                  value={{ musicPosition, setMusicPosition }}
                >
                  {children}
                </MusicPositionContext.Provider>
              </MusicDurationContext.Provider>
            </MusicPlayingContext.Provider>
          </PlayingMusicContext.Provider>
        </PlayerContext.Provider>
      </ChangesInProcessContext.Provider>
    </DownloadInProcessContext.Provider>
  );
}
