import { ReporterInterface } from "./Ireporter";
import { LevelInterface } from "./Ilevel";
import { ProcessInterface } from "./Iprocess";
export interface AccidentsInterface {
  ID: number;
  Description: string;
  Latitude: string;
  Longitude: string;
  Time: Date;
  Contact: string;
  ImageID: string;
  ProcessStatusID: number;
  ProcessStatus: ProcessInterface;
  ReporterID: number;
  Reporter: ReporterInterface;
  LevelID: number;
  Level: LevelInterface;
}
