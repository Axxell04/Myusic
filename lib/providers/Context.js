import { useEffect, useState } from "react";
import { ProviderConnection } from "./ProviderConnection";
import { ProviderProcesses } from "./ProviderProcesses";
import { ProviderModals } from "./ProviderModals";
import { ProviderLists } from "./ProviderLists";
import { ProviderSelections } from "./ProviderSelections";
import { ProviderChanges } from "./ProviderChanges";
import { ProviderFiles } from "./ProviderFiles";
import { ProviderModels } from "./ProviderModels";
import { ProviderYT } from "./ProviderYT";

export function Providers({ children }) {
  return (
    <>
      <ProviderConnection>
        <ProviderProcesses>
          <ProviderModals>
            <ProviderYT>
              <ProviderLists>
                <ProviderFiles>
                  <ProviderModels>
                    <ProviderSelections>
                      <ProviderChanges>{children}</ProviderChanges>
                    </ProviderSelections>
                  </ProviderModels>
                </ProviderFiles>
              </ProviderLists>
            </ProviderYT>
          </ProviderModals>
        </ProviderProcesses>
      </ProviderConnection>
    </>
  );
}

// export { IpServerContext, ConnectWsContext };
