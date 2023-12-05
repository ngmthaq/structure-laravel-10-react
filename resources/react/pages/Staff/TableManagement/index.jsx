import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";
import { AdminLayout } from "../../../layouts/AdminLayout";
import {
  FloorMap,
  STATE_AVAILABLE,
  STATE_BLOCKED,
  STATE_IN_USE,
  STATE_LATED,
  STATE_ORDERED,
  STATE_OVERSTAY,
  STATE_RESERVED,
} from "../../../components/FloorMap";
import { tableAsyncActions } from "../../../reducers/table.reducer";
import { CircleTable } from "../../../components/FloorMap/CircleTable";
import { TABLE_TYPE } from "../../../const/app.const";
import { SquareTable } from "../../../components/FloorMap/SquareTable";
import { commonActions } from "../../../reducers/common.reducer";
import { useEventBus } from "../../../plugins/bus.plugin";
import { EVENT_BUS } from "../../../const/event.const";

export const TableManagement = () => {
  const dispatch = useDispatch();

  const eventBus = useEventBus();

  const [payload, setPayload] = useState({
    startTime: dayjs().format("YYYY-MM-DD hh:mm A"),
    finishTime: dayjs().add(1, "hour").format("YYYY-MM-DD hh:mm A"),
    novalidate: true,
  });

  const [tables, setTables] = useState([]);

  const getTableState = (table) => {
    const seatNumber = table.seats.length;
    const seatedNumber = table.seats.filter((seat) => seat.isSeated).length;

    let state = null;
    let usage = 0;

    if (table.isBlock) {
      state = STATE_BLOCKED.value;
    } else if (seatedNumber > 0 && table.bills && table.bills.length > 0) {
      const bill = table.bills[0];
      if (
        bill.startAt &&
        bill.endAt &&
        bill.confirmedAt &&
        new Date(bill.startAt).valueOf() < Date.now() &&
        !bill.userStartedAt
      ) {
        state = STATE_LATED.value;
      } else if (
        bill.startAt &&
        bill.endAt &&
        bill.confirmedAt &&
        bill.userStartedAt &&
        new Date(bill.endAt).valueOf() < Date.now()
      ) {
        state = STATE_OVERSTAY.value;
      } else if (bill.startAt && bill.endAt && bill.confirmedAt && bill.userStartedAt) {
        state = STATE_IN_USE.value;
      } else if (!bill.confirmedAt) {
        state = STATE_RESERVED.value;
      } else {
        state = STATE_ORDERED.value;
      }

      if (new Date(bill.endAt).valueOf() - new Date(bill.startAt).valueOf() === 0) {
        usage = 1;
      } else {
        usage =
          (Date.now() - new Date(bill.startAt).valueOf()) /
          (new Date(bill.endAt).valueOf() - new Date(bill.startAt).valueOf());
      }
    } else {
      state = STATE_AVAILABLE.value;
    }

    usage *= 100;

    return {
      seatNumber,
      seatedNumber,
      state,
      usage,
    };
  };

  const getAvailableTables = async () => {
    if (payload.startTime && payload.finishTime) {
      dispatch(commonActions.openLinearLoading());
      const response = await dispatch(tableAsyncActions.staffGetAvailableTables({ ...payload })).unwrap();
      dispatch(commonActions.closeLinearLoading());
      setTables(
        response.map((table) => ({
          ...table,
          ...getTableState(table),
        })),
      );
    }
  };

  useEffect(() => {
    getAvailableTables();
  }, [payload]);

  useEffect(() => {
    const refresh = (date) => {
      setPayload((state) => ({
        ...state,
        startTime: dayjs(date).format("YYYY-MM-DD hh:mm A"),
        finishTime: dayjs(date).add(1, "hour").format("YYYY-MM-DD hh:mm A"),
      }));
    };

    eventBus.on(EVENT_BUS.refreshGetAvailableTable, refresh);

    return () => {
      eventBus.off(EVENT_BUS.refreshGetAvailableTable, refresh);
    };
  }, []);

  return (
    <AdminLayout>
      <FloorMap>
        {tables.map((table) =>
          table.type === TABLE_TYPE.circle ? (
            <CircleTable
              key={table.id}
              id={table.id}
              position={[table.positionX, table.positionY]}
              state={table.state}
              usage={table.usage}
              seats={table.seatNumber}
              seated={table.seatedNumber}
              bills={table.bills}
            />
          ) : (
            <SquareTable
              key={table.id}
              id={table.id}
              position={[table.positionX, table.positionY]}
              state={table.state}
              usage={table.usage}
              seats={table.seatNumber}
              seated={table.seatedNumber}
              dir={table.direction}
              bills={table.bills}
            />
          ),
        )}
      </FloorMap>
    </AdminLayout>
  );
};
