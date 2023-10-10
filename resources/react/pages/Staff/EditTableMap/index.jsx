import React from "react";
import { AdminLayout } from "../../../layouts/AdminLayout";
import { FloorMap, STATE_EDITING } from "../../../components/FloorMap";
import { CircleTable } from "../../../components/FloorMap/CircleTable";

export const EditTableMap = () => {
  return (
    <AdminLayout>
      <FloorMap>
        <CircleTable id={1} position={[150, 150]} state={STATE_EDITING.value} usage={80} seats={6} seated={1} />
        <CircleTable id={2} position={[300, 150]} state={STATE_EDITING.value} usage={80} seats={6} seated={1} />
      </FloorMap>
    </AdminLayout>
  );
};
