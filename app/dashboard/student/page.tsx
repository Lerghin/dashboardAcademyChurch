
import BigCalendar from "@/app/components/BigCalender"
import EventCalendar from "@/app/components/EventCalendar"



const StudentPage = () => {

    return (

        <div className="p-4 flex gap-4 flex-col xl:flex-row">
            {/*LEFT*/}
            <div className=" w-full xl:w-2/3">
                <div className="h-full  bg-white p-4 rounded-md">
                    <h1 className="text-xl font-semibold ">Shedule (4A)</h1>
                    <BigCalendar />
                </div>

            </div>
            {/*Right*/}
            <div className="w-full xl:w-1/3 flex flex-col gap-8">
                <EventCalendar />
             
            </div>

        </div>
    )
}
export default StudentPage