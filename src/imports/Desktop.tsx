import imgDesktop from "figma:asset/e03ba8e7d9435d612584776eae97ca755b6140a2.png";

function MainStats() {
  return (
    <div className="bg-[rgba(0,227,255,0.1)] h-[100px] relative rounded-[7px] shrink-0 w-full" data-name="MainStats">
      <div className="flex flex-col items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-center justify-center px-[50px] py-[10px] relative size-full">
          <p className="font-['Electrolize:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#efefef] text-[48px]">Main Stats</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-5 border-[rgba(3,64,120,0.25)] border-solid inset-0 pointer-events-none rounded-[7px]" />
    </div>
  );
}

function PreviousLogs() {
  return (
    <div className="bg-[rgba(0,227,255,0.1)] h-[100px] relative rounded-[7px] shrink-0 w-full" data-name="PreviousLogs">
      <div className="flex flex-col items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-center justify-center px-[50px] py-[10px] relative size-full">
          <p className="font-['Electrolize:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#efefef] text-[48px]">Logs</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-5 border-[rgba(3,64,120,0.25)] border-solid inset-0 pointer-events-none rounded-[7px]" />
    </div>
  );
}

function AllSettings() {
  return (
    <div className="bg-[rgba(0,227,255,0.1)] h-[100px] relative rounded-[7px] shrink-0 w-full" data-name="AllSettings">
      <div className="flex flex-col items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-center justify-center px-[50px] py-[10px] relative size-full">
          <p className="font-['Electrolize:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#efefef] text-[48px]">Settings</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-5 border-[rgba(3,64,120,0.25)] border-solid inset-0 pointer-events-none rounded-[7px]" />
    </div>
  );
}

export default function Desktop() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-center px-[140px] py-[300px] relative size-full" data-name="Desktop">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgDesktop} />
      <MainStats />
      <PreviousLogs />
      <AllSettings />
    </div>
  );
}