import { Tooltip } from "@mui/material";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { useState } from "react";
import styles from "./tooltip.module.scss";

export const ToolTipCell = (param: GridRenderCellParams) => {
  const [open, setOpen] = useState<boolean>(false);

  const handleShowTooltip = () => {
    setOpen((prev) => !prev);
  };

  return (
    <Tooltip
      open={open}
      placement="right"
      disableFocusListener
      disableHoverListener
      disableTouchListener
      title={param.value}
    >
      <div className={styles.tooltip} onClick={handleShowTooltip}>
        {param.value}
      </div>
    </Tooltip>
  );
};
