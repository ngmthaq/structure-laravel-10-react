import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Button, ButtonGroup } from "@mui/material";
import { AddCircleOutline, TableChart } from "@mui/icons-material";
import { AdminLayout } from "../../../layouts/AdminLayout";
import { FloorMap, STATE_EDITED, STATE_EDITING } from "../../../components/FloorMap";
import { CircleTable } from "../../../components/FloorMap/CircleTable";
import { __ } from "../../../plugins/i18n.plugin";
import { SquareTable } from "../../../components/FloorMap/SquareTable";
import { TABLE_DIR, TABLE_TYPE } from "../../../const/app.const";
import { CreateTableDialog } from "./CreateTableDialog";
import { DataTableDialog } from "./DataTableDialog";
import { tableAsyncActions } from "../../../reducers/table.reducer";
import { commonActions } from "../../../reducers/common.reducer";
import { PrimaryNotificationModel } from "../../../models/primary.notification.model";

export const EditTableMap = () => {
  const dispatch = useDispatch();

  const [isOpenCreateTableDialog, setIsOpenCreateTableDialog] = useState(false);

  const [isOpenDataTableDialog, setIsOpenDataTableDialog] = useState(false);

  const [tables, setTables] = useState([]);

  const onOpenCreateTableDialog = () => {
    setIsOpenCreateTableDialog(true);
  };

  const onCloseCreateTableDialog = () => {
    setIsOpenCreateTableDialog(false);
  };

  const onOpenDataTableDialog = () => {
    setIsOpenDataTableDialog(true);
  };

  const onCloseDataTableDialog = () => {
    setIsOpenDataTableDialog(false);
  };

  const onTableChangePosition = async (id, position) => {
    try {
      dispatch(commonActions.openLinearLoading());
      await dispatch(tableAsyncActions.changePosition({ x: position[0], y: position[1], id: id })).unwrap();
      dispatch(commonActions.closeLinearLoading());
    } catch (error) {
      dispatch(commonActions.closeLinearLoading());
      dispatch(
        commonActions.appendPrimaryNotification(PrimaryNotificationModel("error", __("custom.something-wrong"))),
      );
    }
  };

  const onCreateNewTable = async (payload) => {
    try {
      dispatch(commonActions.openLinearLoading());
      const table = await dispatch(tableAsyncActions.createTable(payload)).unwrap();
      dispatch(commonActions.closeLinearLoading());
      setTables((state) => [...state, { ...table, state: STATE_EDITING.value }]);
      onCloseCreateTableDialog();
    } catch (error) {
      dispatch(commonActions.closeLinearLoading());
      if (error.status && error.status === 422) {
        const notifications = Object.values(error.data.errors).map((e) => PrimaryNotificationModel("error", e[0]));
        dispatch(commonActions.appendPrimaryNotification(JSON.stringify(notifications)));
      } else {
        dispatch(
          commonActions.appendPrimaryNotification(PrimaryNotificationModel("error", __("custom.something-wrong"))),
        );
      }
    }
  };

  useEffect(() => {
    const getTables = async () => {
      const data = await dispatch(tableAsyncActions.getTables()).unwrap();
      setTables(data.map((table) => ({ ...table, state: STATE_EDITED.value })));
    };

    getTables();
  }, []);

  console.log(tables);

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
        <Button
          sx={{ width: "40px", height: "40px" }}
          variant="contained"
          title={__("custom.show-data-table")}
          onClick={onOpenDataTableDialog}
        >
          <TableChart fontSize="small" />
        </Button>
      </ButtonGroup>
      <FloorMap>
        {tables.map((table) =>
          table.type === TABLE_TYPE.circle ? (
            <CircleTable
              key={table.id}
              id={table.id}
              position={[table.positionX, table.positionY]}
              state={table.state}
              usage={0}
              seats={table.seats ? table.seats.length : 0}
              seated={0}
              onChangePosition={onTableChangePosition}
            />
          ) : (
            <SquareTable
              key={table.id}
              id={table.id}
              position={[table.positionX, table.positionY]}
              state={table.state}
              usage={0}
              seats={table.seats ? table.seats.length : 0}
              seated={0}
              dir={table.direction}
              onChangePosition={onTableChangePosition}
            />
          ),
        )}
      </FloorMap>
      <CreateTableDialog
        open={isOpenCreateTableDialog}
        onClose={onCloseCreateTableDialog}
        onSubmit={onCreateNewTable}
      />
      <DataTableDialog open={isOpenDataTableDialog} onClose={onCloseDataTableDialog} />
    </AdminLayout>
  );
};
