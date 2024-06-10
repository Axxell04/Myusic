import { useEffect, useState } from "react";
import { ProviderConnection } from "../providers/ProviderConnection";
import { ProviderProcesses } from "../providers/ProviderProcesses";
import { ProviderModals } from "../providers/ProviderModals";
import { ProviderLists } from "../providers/ProviderLists";
import { ProviderSelections } from "../providers/ProviderSelections";
import { ProviderChanges } from "../providers/ProviderChanges";
import { ProviderFiles } from "../providers/ProviderFiles";
import { ProviderModels } from "../providers/ProviderModels";

export function Providers({ children }) {
  return (
    <>
      <ProviderConnection>
        <ProviderProcesses>
          <ProviderModals>
            <ProviderSelections>
              <ProviderLists>
                <ProviderFiles>
                  <ProviderModels>
                    <ProviderChanges>
                      {children}
                    </ProviderChanges>
                  </ProviderModels>
                </ProviderFiles>
              </ProviderLists>
            </ProviderSelections>
          </ProviderModals>
        </ProviderProcesses>
      </ProviderConnection>
    </>
  );
}

// export { IpServerContext, ConnectWsContext };
