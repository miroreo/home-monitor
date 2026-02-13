const TRAINTRACKER_URL = "https://lapi.transitchicago.com/api/1.0";
const BUSTRACKER_URL = "http://www.ctabustracker.com/bustime/api/v2/";
const ALERTS_URL = "https://www.transitchicago.com/api/1.0/alerts.aspx?outputType=JSON";
const L_LINES = ["red","blue","g","brn","p","y","pink","org"];
export type TransitArrival = {
  vehicleNumber: number,
  route: string,
  destination: string,
  arrivalTime: Date,
  isApproaching?: boolean,
  isScheduled?: boolean,
  isDelayed?: boolean,
  mode: "bus" | "train"
}
type ImpactedService = {
  ServiceType: string,
  ServiceTypeDescription: string,
  ServiceName: string,
  ServiceId: string,
  ServiceBackColor: string,
  ServiceTextColor: string,
}
export class CTA {
    trainTracker: TrainTracker;
    busTracker: BusTracker;
    constructor(trainTrackerKey: string, busTrackerKey: string) {
        this.trainTracker = new TrainTracker(trainTrackerKey);
        this.busTracker = new BusTracker(busTrackerKey);
    }

    static async getAlerts(): Promise<TransitAlert[]> {
      const request_url = `${ALERTS_URL}&routeid=${L_LINES.join(",")}`;
      // console.log(request_url);
      const resp = await fetch(request_url);
      const data: {CTAAlerts:{
        TimeStamp: string,
        ErrorMessage?: string,
        Alert?: {
          Impact: string,
          EventStart: string,
          EventEnd?: string,
          TBD: string,
          MajorAlert: string,
          SeverityScore: string,
          SeverityColor: string,
          ShortDescription: string,
          Headline: string,
          AlertId: string,
          ImpactedService: {Service: ImpactedService[] | ImpactedService}
        }[]
      }} = await resp.json().catch(async (e) => {
        // console.error(e);
        // console.log(await resp.text())
      });
      const alerts: TransitAlert[] = [];
      if(data.CTAAlerts.ErrorMessage != null) {
        console.error(data.CTAAlerts.ErrorMessage);
        return alerts;
      }
      data.CTAAlerts.Alert?.forEach((alert) => {
        
        alerts.push({
          id: parseInt(alert.AlertId),
          description: alert.ShortDescription,
          headline: alert.Headline,
          impact: alert.Impact,
          severity: {
            score: parseInt(alert.SeverityColor),
            color: alert.SeverityColor,
          },
          impactedServices: (Array.isArray(alert.ImpactedService.Service) ? 
            alert.ImpactedService.Service.map(s => {return {
              backgroundColor: s.ServiceBackColor,
              textColor: s.ServiceTextColor,
              serviceName: s.ServiceName,
              serviceTypeDescription: s.ServiceTypeDescription,
              serviceType: {"X": "System", "R": "Train", "B": "Bus", "T": "Station"}[s.ServiceType] as "System" | "Train" | "Bus" | "Station",
            }})
          
          : [{
              backgroundColor: alert.ImpactedService.Service.ServiceBackColor,
              textColor: alert.ImpactedService.Service.ServiceTextColor,
              serviceName: alert.ImpactedService.Service.ServiceName,
              serviceTypeDescription: alert.ImpactedService.Service.ServiceTypeDescription,
              serviceType: {"X": "System", "R": "Train", "B": "Bus", "T": "Station"}[alert.ImpactedService.Service.ServiceType] as "System" | "Train" | "Bus" | "Station",
            }]),
            major: alert.MajorAlert == "1",
            start: new Date(alert.EventStart),
            tbd: alert.TBD == "1",
            end: alert.EventEnd ? new Date(alert.EventEnd) : undefined,
        });
      });
      return alerts;
    }
}

class TrainTracker {
    private apiKey: string;
    constructor(key: string) {
        this.apiKey = key;
    }
    async getArrivals(stationId: number) {
        const request_url = `${TRAINTRACKER_URL}/ttarrivals.aspx?key=${this.apiKey}&mapid=${stationId}&outputType=JSON`;
        const resp = await fetch(request_url);
        
        const data = await resp.json() as {ctatt: {eta?: TTArrival[] | TTArrival}};
        if(!data.ctatt.eta) {
            console.log(data.ctatt);
        }
        let arrivals: TransitArrival[] = [];
        if(data.ctatt.eta !== undefined) {
            if(Array.isArray(data.ctatt.eta)) {
                arrivals = data.ctatt.eta.map(this.parseArrival);
            } else {
                arrivals = [this.parseArrival(data.ctatt.eta)];
            }
        }
        return arrivals;
    }
    parseArrival(raw: TTArrival): TransitArrival {
        return {
            vehicleNumber: parseInt(raw.rn),
            route: stringToTrainRoute(raw.rt).toString(),
            destination: raw.destNm,
            arrivalTime: new Date(raw.arrT),
            isApproaching: raw.isApp == "1",
            isDelayed: raw.isDly == "1",
            isScheduled: raw.isSch == "1",
            mode: "train"
        }
    }
}
type TTArrival = {
    rn: string,
    rt: string,
    destNm: string,
    prdt: string,
    arrT: string,
    isApp: string,
    isSch: string,
    isDly: string,
}
export type Arrival = {
    run: number,
    route: TrainRoute,
    destination: string,
    predictionTime: Date,
    arrivalTime: Date,
    isApproaching: boolean,
    isScheduled: boolean,
    isDelayed: boolean,
}
export enum TrainRoute {
    Red = "Red",
    Blue = "Blue",
    Orange = "Orange",
    Green = "Green",
    Pink = "Pink",
    Purple = "Purple",
    Brown = "Brown",
    Yellow = "Yellow",
    Unknown = "Unknown"
}
const stringToTrainRoute = (lineString: string): TrainRoute => {
  lineString = lineString.toLowerCase();
  switch (lineString) {
    case "red":
      return TrainRoute.Red;
    case "blue":
      return TrainRoute.Blue;
    case "g":
      return TrainRoute.Green;
    case "brn":
      return TrainRoute.Brown;
    case "p":
      return TrainRoute.Purple;
    case "y":
      return TrainRoute.Yellow;
    case "pnk":
      return TrainRoute.Pink;
    case "pink":
      return TrainRoute.Pink;
    case "o":
      return TrainRoute.Orange;
    case "org":
      return TrainRoute.Orange;
    default:
      return TrainRoute.Unknown;
  }
}
export const lineColor = (line: TrainRoute) => {
  switch (line) {
    case TrainRoute.Blue:
      return 0x00a1de;
    case TrainRoute.Red:
      return 0xc60c30;
    case TrainRoute.Green:
      return 0x009b3a;
    case TrainRoute.Orange:
      return 0xf9461c;
    case TrainRoute.Yellow:
      return 0xf9e300;
    case TrainRoute.Purple:
      return 0x522398;
    case TrainRoute.Brown:
      return 0x62361b;
    case TrainRoute.Pink:
      return 0xe27ea6;
    default:
      return 0x000000;
  }
};
class BusTracker {
    private apiKey: string;
    constructor(key: string) {
        this.apiKey = key;
    }
    async getPredictions(stopNumber: number) {
      const requestUrl = `${BUSTRACKER_URL}/getpredictions?key=${this.apiKey}&stpid=${stopNumber}&format=json`;
      const resp = await fetch(requestUrl);
      // console.log(await resp.text())
      const data = await resp.json() as {
        "bustime-response": {
          prd: BusTimePrediction[]
        }
      };
      return data["bustime-response"].prd?.map((p) => {
        return {
          destination: p.des,
          route: p.rt,
          vehicleNumber: parseInt(p.vid),
          arrivalTime: new Date(
            parseInt(p.prdtm.slice(0, 4)),
            parseInt(p.prdtm.slice(4,6)) -1,
            parseInt(p.prdtm.slice(6,8)),
            parseInt(p.prdtm.slice(9, 11)),
            parseInt(p.prdtm.slice(12))),
          mode: "bus"
        } as TransitArrival
      })
    }
}
export type BusTimePrediction = {
  tmstmp: string,
  vid: string,
  rt: string,
  des: string,
  prdctdn: string,
  prdtm: string,
}
export type BusArrival = {
  time: Date,
  vehicleId: string,
  route: string,
  destination: string,
  minsUntilArrival: number,
  predictedTime: Date
};

export type TransitAlert = {
  id: number,
  headline: string,
  description: string,
  severity: {
    score: number,
    color: string
  },
  impact: string,
  start: Date,
  end?: Date,
  tbd: boolean,
  major: boolean,
  impactedServices: {
    serviceType: "System" | "Train" | "Bus" | "Station",
    serviceName: string,
    serviceTypeDescription: string,
    backgroundColor: string,
    textColor: string
  }[]
}
