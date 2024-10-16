const Table=({columns, renderRow, data}:{columns:{header:string, accesor:string, className?:string }[];
     renderRow: (item:any)=> React.ReactNode;
    data:any []

})=>{
 return(


    <div className="w-100 mt-4  ">
        <thead>
         <tr className="text-left tex-gray-500 text-sm ">
            {columns.map(col=> 
                <th key={col.accesor} className={col.className}>{col.header}</th>

            )}
         </tr>

        </thead>
        <tbody>
            {data.map((item)=>renderRow(item))}



        </tbody>
       
        </div>
 )



}
export default Table;