import React from "react";

import { api } from "~/utils/api";

function Page() {
  const { mutate } = api.bomDia.createBomDia.useMutation();
  return (
    <div>
      <button className="font-bold bg-slate-400 p-10 m-5 rounded-md" onClick={() => mutate()}>Nova imagem</button>
    </div>
  );
}

export default Page;
