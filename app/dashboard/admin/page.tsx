
import AttendanceChart from "@/app/components/AttendanceChart"
import CountChart from "@/app/components/CountChart"
import EventCalendar from "@/app/components/EventCalendar"
import FinanceChart from "@/app/components/FinanceChart"
import UseCard from "@/app/components/UseCard"
import { API_URL } from "@/app/lib/config"



const AdminPage =async () => {
  const response = await fetch(`${API_URL}miembro/get/number`, { cache: "no-store" });
  const miembroData= await response.json();
  const responseProf = await fetch(`${API_URL}profe/get/number`, { cache: "no-store" });
  const profData= await responseProf.json();
    return (
<div className="p-4 flex gap-4 flex-col md:flex-row">
      {/* LEFT */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* USER CARDS */}
        <div className="flex gap-4 justify-between flex-wrap">
          <UseCard type="Miembros" data={miembroData}  />
          <UseCard type="Profesores"  data={profData}  />
       
        </div>
        {/* MIDDLE CHARTS */}
        <div className="flex gap-4 flex-col lg:flex-row">
          {/* COUNT CHART */}
          <div className="w-full lg:w-1/3 h-[450px]">
            <CountChart />
          </div>
          {/* ATTENDANCE CHART */}
          <div className="w-full lg:w-2/3 h-[450px]">
            <AttendanceChart />
          </div>
        </div>
        {/* BOTTOM CHART */}
        <div className="w-full h-[500px]">
          <FinanceChart />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <EventCalendar />
     
      
      </div>
    </div>
  );
};
    


export default AdminPage