import { columns, Team } from "./columns"
import { DataTable } from "./data-table"
export default function Teams(){
  const data: Team[] = [
    {
      id: "badminton",
      sport: "Badminton",
      points: 10,
    },
    {
      id: "baseball",
      sport: "Baseball",
      points: 10,
    },
    {
      id: "basketball",
      sport: "Basketball",
      points: 10,
    },
    {
      id: "cross-country",
      sport: "Cross-Country",
      points: 5,
    },
    {
      id: "curling",
      sport: "Curling",
      points: 10,
    },
    {
      id: "field-hockey",
      sport: "Field Hockey",
      points: 10,
    },
    {
      id: "golf",
      sport: "Golf",
      points: 5,
    },
    {
      id: "hockey",
      sport: "Hockey",
      points: 10,
    },
    {
      id: "rock-climbing",
      sport: "Rock Climbing",
      points: 5,
    },
    {
      id: "rugby-fifteens",
      sport: "Rugby Fifteens",
      points: 10,
    },
    {
      id: "rugby-sevens",
      sport: "Rugby Sevens",
      points: 10,
    },
    {
      id: "slo-pitch",
      sport: "Slo Pitch",
      points: 10,
    },
    {
      id: "soccer",
      sport: "Soccer",
      points: 10,
    },
    {
      id: "swimming",
      sport: "Swimming",
      points: 10,
    },
    {
      id: "table-tennis",
      sport: "Table Tennis",
      points: 5,
    },
    {
      id: "tennis",
      sport: "Tennis",
      points: 5,
    },
    {
      id: "track-and-field",
      sport: "Track and Field",
      points: 10,
    },
    {
      id: "ultimate-frisbee",
      sport: "Ultimate Frisbee",
      points: 10,
    },
    {
      id: "volleyball",
      sport: "Volleyball",
      points: 10,
    }
  ]
  return (
    <div className="px-16 py-24">
      <div className="max-w-4xl justify-self-center w-full">
        <div className="font-bold text-3xl mb-4">Sports</div>
        <DataTable columns={columns} data={data}/>
      </div>
    </div>
  );
}