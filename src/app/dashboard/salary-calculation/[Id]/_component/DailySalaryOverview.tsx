const DailySalaryOverview = () => {
  return (
    <div className="flex gap-6 overflow-y-auto max-h-[calc(100vh-320px)]">
      {/* left side */}
      <div className="w-full">
        <div className="mb-4 sticky top-0 z-10">รายการรายรับ</div>
        {/* Header */}
        <div className="grid grid-cols-5 gap-4 border-b p-4 bg-[#EFEFEF] sticky top-0 z-10">
          <div className="col-span-2 font-semibold">รายการ</div>
          <div className="font-semibold text-right border-l-2 border-[#E0E0E0]">
            จำนวน
          </div>
          <div className="font-semibold text-right border-l-2 border-[#E0E0E0]">
            ราคาต่อหน่วย
          </div>
          <div className="font-semibold text-right border-l-2 border-[#E0E0E0]">
            รวมยอด
          </div>
        </div>

        <div className="p-4 font-semibold">รายรับจากการทำงาน</div>

        {/* Rows */}
        <div className="grid grid-cols-5 gap-4 px-4 py-[8.5px] ">
          <div className="col-span-2">รายได้ประจำ (ค่าแรงรายวัน)</div>
          <div className="text-right">22 วัน</div>
          <div className="text-right">350.00</div>
          <div className="text-right">7,700.00</div>
        </div>

        <div className="grid grid-cols-5 gap-4 px-4 py-[8.5px] ">
          <div className="col-span-2">เข้างานสาย</div>
          <div className="text-right">15 นาที</div>
          <div className="text-right">50.00</div>
          <div className="text-right">750.00</div>
        </div>

        <div className="grid grid-cols-5 gap-4 px-4 py-[8.5px] ">
          <div className="col-span-2">ทำ OT (x 1.5)</div>
          <div className="text-right">22 วัน</div>
          <div className="text-right">350.00</div>
          <div className="text-right">7,700.00</div>
        </div>

        <div className="grid grid-cols-5 gap-4 px-4 py-[8.5px] ">
          <div className="col-span-2">ทำ OT (x 2)</div>
          <div className="text-right">15 นาที</div>
          <div className="text-right">50.00</div>
          <div className="text-right">750.00</div>
        </div>

        <div className="grid grid-cols-5 gap-4 px-4 py-[8.5px] ">
          <div className="col-span-2">นักขัตฤกษ์</div>
          <div className="text-right">22 วัน</div>
          <div className="text-right">350.00</div>
          <div className="text-right">7,700.00</div>
        </div>

        <div className="grid grid-cols-5 gap-4 px-4 py-[8.5px] ">
          <div className="col-span-2">เบี้ยขยัน</div>
          <div className="text-right">15 นาที</div>
          <div className="text-right">50.00</div>
          <div className="text-right">750.00</div>
        </div>

        {/* Summary Row */}
        <div className="flex justify-between p-4 bg-[#F0F9FF]">
          <div className="font-medium">รวมรายรับจากการทำงาน</div>
          <div className="font-medium">
            8,450.00 <span>บาท</span>
          </div>
        </div>

        <div className="p-4 font-semibold">รายรับจากเงินพิเศษ</div>

        <div className="grid grid-cols-5 gap-4 px-4 py-[8.5px] ">
          <div className="col-span-2">
            เงินพิเศษ <span className="text-inactive">(อบรมที่ MB)</span>
          </div>
          <div></div>
          <div className="text-right">200.00</div>
          <div className="text-right">200.00</div>
        </div>

        <div className="grid grid-cols-5 gap-4 px-4 py-[8.5px] ">
          <div className="col-span-2">
            เงินพิเศษ <span className="text-inactive">(เงินพิเศษลูกค้า)</span>
          </div>
          <div></div>
          <div className="text-right">1,000.00</div>
          <div className="text-right">1,000.00</div>
        </div>

        <div className="flex justify-between p-4 bg-[#F0F9FF]">
          <div className="font-medium">รวมยอดเงินพิเศษ</div>
          <div className="font-medium">
            1,200.00 <span>บาท</span>
          </div>
        </div>

        <div className="flex justify-between p-4 bg-[#E0F2FE]">
          <div className="font-semibold">รวมรายได้ทั้งหมด</div>
          <div className="font-semibold">
            8,450.00 <span>บาท</span>
          </div>
        </div>
      </div>

      {/* right side */}
      <div className="w-full flex flex-col justify-between">
        <div>
          <div className="mb-4 sticky top-0 z-10">รายการรายจ่าย</div>
          {/* Header */}
          <div className="grid grid-cols-4 gap-4 border-b p-4 bg-[#EFEFEF] sticky top-0 z-10">
            <div className="col-span-2 font-semibold">รายการ</div>
            <div className="font-semibold text-right border-l-2 border-[#E0E0E0]">
              ราคาต่อหน่วย
            </div>
            <div className="font-semibold text-right border-l-2 border-[#E0E0E0]">
              รวมยอด
            </div>
          </div>

          {/* Rows*/}
          <div className="grid grid-cols-4 gap-4 px-4 py-[8.5px] ">
            <div className="col-span-2">เบิกเงินล่วงหน้า</div>
            <div className="text-right">350.00</div>
            <div className="text-right">7,700.00</div>
          </div>

          <div className="grid grid-cols-4 gap-4 px-4 py-[8.5px] ">
            <div className="col-span-2">ค่าธรรมเนียม</div>
            <div className="text-right">50.00</div>
            <div className="text-right">750.00</div>
          </div>

          <div className="grid grid-cols-4 gap-4 px-4 py-[8.5px] ">
            <div className="col-span-2">ชุดฟอร์ม</div>
            <div className="text-right">350.00</div>
            <div className="text-right">7,700.00</div>
          </div>

          <div className="grid grid-cols-4 gap-4 px-4 py-[8.5px] ">
            <div className="col-span-2">หักกู้เงิน</div>
            <div className="text-right">50.00</div>
            <div className="text-right">750.00</div>
          </div>

          <div className="grid grid-cols-4 gap-4 px-4 py-[8.5px] ">
            <div className="col-span-2">
              หักค่าอื่นๆ (ค่าประกันสังคม ก.ย. 67)
            </div>
            <div className="text-right">350.00</div>
            <div className="text-right">7,700.00</div>
          </div>

          <div className="grid grid-cols-4 gap-4 px-4 py-[8.5px] ">
            <div className="col-span-2">ค่าประกันสังคม</div>
            <div className="text-right">50.00</div>
            <div className="text-right">750.00</div>
          </div>
        </div>

        {/* Summary */}
        <div>
          <div className="flex justify-between p-4 bg-[#FFF7E6]">
            <div className="font-medium">รวมยอดหักเงิน</div>
            <div className="font-medium">
              1,200.00 <span>บาท</span>
            </div>
          </div>

          <div className="flex justify-between p-4 bg-[#FFE7BA]">
            <div className="font-semibold">รวมรายได้ทั้งหมด</div>
            <div className="font-semibold">
              8,450.00 <span>บาท</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailySalaryOverview;
