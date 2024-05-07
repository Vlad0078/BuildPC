import {
  Card,
  CardContent,
  Grid,
  Typography,
  CardActions,
  Button,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import React from "react";
import { PCComponent } from "../models/pc_component";

const useStyles = makeStyles(() => ({
  twoLineTypography: {
    display: "-webkit-box",
    overflow: "hidden",
    "-webkit-line-clamp": 2,
    "-webkit-box-orient": "vertical",
    "@media (orientation: portrait)": {
      "-webkit-line-clamp": 3,
    },
  },
}));

interface AssemblyCellProps {
  componentId: number; // індекс компонента в збірці
  component: PCComponent;
}

const AssemblyCell: React.FC<AssemblyCellProps> = ({
  componentId, // в межах збірки
  component,
}) => {
  const classes = useStyles();

  const specList = Object.values(component.specs);
  const specString = specList
    .map((spec) => `${spec.prettyName}: ${spec.prettyValue}`)
    .join(", ");

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent sx={{ pb: "0.5rem" }}>
        <Grid container spacing={2} alignItems="center" wrap="nowrap">
          <Grid item>
            <img
              src={component.imageBig}
              style={{
                height: "min(150px, 25vw)",
                width: "min(150px, 25vw)",
              }}
            />
          </Grid>
          <Grid item>
            <Typography
              variant="h5"
              component="div"
              className={classes.twoLineTypography}
            >
              {component.name}
            </Typography>
            <Typography
              color="text.secondary"
              variant="subtitle1"
              sx={{
                mt: 1.5,
                "@media (orientation: portrait)": {
                  display: "none",
                },
              }}
            >
              {specString}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        <Button size="medium" color="primary">
          Відкрити
        </Button>
        <Button size="medium" color="error">
          Видалити зі збірки
        </Button>
      </CardActions>
    </Card>
  );
};

export default AssemblyCell;
