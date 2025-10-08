import Navigation from "@/components/navbar";

export default function StudentPage({params: {id}}: {params: {id: string}}){
  return (
    <>
      <Navigation />
      <div>
        <h1>Student {id}</h1>
      </div>
    </>
  )
}