import Image from "next/image"


const Navbar = () => {
    return (

        <div className="flex items-center justify-between p-4">

           
            {/*Icons and user*/}
            <div className=" flex items-center gap-6 justify-end w-full">
              
                <div className="flex flex-col">
                    <span className="text-xs leading-3 font-medium">
                        Jhon Doe
                    </span>
                    <span className=" text-[10px] text-gray-500  text-right">
                        Admin
                    </span>
                </div>
                <Image src="/avatar.png" alt="avatar" width={36} height={36} className="rounded-full"></Image>
            </div>
        </div>
    )

}

export default Navbar