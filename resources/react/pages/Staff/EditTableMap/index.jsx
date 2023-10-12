import React, { useState } from "react";
import { Button, ButtonGroup } from "@mui/material";
import { AddCircleOutline } from "@mui/icons-material";
import { AdminLayout } from "../../../layouts/AdminLayout";
import { FloorMap, STATE_EDITING } from "../../../components/FloorMap";
import { CircleTable } from "../../../components/FloorMap/CircleTable";
import { __ } from "../../../plugins/i18n.plugin";
import { CreateTableDialog } from "./CreateTableDialog";

export const EditTableMap = () => {
  const [isOpenCreateTableDialog, setIsOpenCreateTableDialog] = useState(false);

  const onOpenCreateTableDialog = () => {
    setIsOpenCreateTableDialog(true);
  };

  const onCloseCreateTableDialog = () => {
    setIsOpenCreateTableDialog(false);
  };

  const onCreateNewTable = (payload) => {};

  return (
    <AdminLayout>
      <ButtonGroup orientation="vertical" sx={{ position: "absolute", top: "100px", left: "16px", zIndex: 2 }}>
        <Button
          sx={{ width: "40px", height: "40px" }}
          variant="contained"
          title={__("custom.admin-tables-create-title")}
          onClick={onOpenCreateTableDialog}
        >
          <AddCircleOutline fontSize="small" />
        </Button>
      </ButtonGroup>
      <FloorMap>
        <CircleTable id={1} position={[150, 150]} state={STATE_EDITING.value} usage={80} seats={6} seated={1} />
        <CircleTable id={2} position={[300, 150]} state={STATE_EDITING.value} usage={80} seats={6} seated={1} />
      </FloorMap>
      <CreateTableDialog
        open={isOpenCreateTableDialog}
        onClose={onCloseCreateTableDialog}
        onSubmit={onCreateNewTable}
      />
    </AdminLayout>
  );
};
