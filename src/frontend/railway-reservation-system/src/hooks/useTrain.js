// src/hooks/useTrain.js
import { useContext } from "react";
import { TrainContext } from "../context/TrainContext";

export const useTrain = () => useContext(TrainContext);
