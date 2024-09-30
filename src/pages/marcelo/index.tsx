import React from "react";

import { api } from "~/utils/api";
function Page() {
  const { mutate } = api.bomDia.createBomDia.useMutation();
  return (
    <div>
      <button onClick={() => mutate()}>noma imagem</button>
    </div>
  );
}

export default Page;
