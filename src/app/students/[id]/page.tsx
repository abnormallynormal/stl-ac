export default function StudentPage({params: {id}}: {params: {id: string}}){
  return (
    <div>
      <h1>Student {id}</h1>
    </div>
  )
}