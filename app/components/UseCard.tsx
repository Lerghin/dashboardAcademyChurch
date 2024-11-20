import Image from "next/image"

const UseCard = ({ data, type }: { data: any; type: string }) => {
  const now = new Date();
  const formattedDate = now.toLocaleDateString('en-US', {
    weekday: 'short', 
    year: 'numeric',  
    month: 'short',  
    day: 'numeric',   
  });

  return (
    <div className="rounded-2xl odd:bg-lamaPurple even:bg-lamaYellow p-4 flex-1 min-w-[130px]">
      <div className="flex justify-between items-center">
        <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-600">
          {formattedDate}
        </span>
        <Image src="/more.png" alt="more" width={20} height={20} />
      </div>
      <h1 className="text-2xl font-bold my-4 text-gray-500">Registrados: <span className="text-center font-semibold  text-gray-500 text-center"> {data}</span></h1>
      <h2 className="capitalize text-sm font-medium text-gray-500">{type}</h2>
    </div>
  );
}

export default UseCard;
