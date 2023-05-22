export default function LoaderPulse({ loadertext }) {
    const txt = loadertext ? loadertext : '';
    return (
        <div className="flex items-center justify-center space-x-1">
            <div className="inline-block w-1 h-1 bg-black rounded-full opacity-0 spinner-grow animate-pulse"/>
            <div className="inline-block w-2 h-2 bg-black rounded-full opacity-0 spinner-grow animate-pulse"/>
            <div className="inline-block w-3 h-3 bg-black rounded-full opacity-0 spinner-grow animate-pulse"/>
            <div className="inline-block w-4 h-4 bg-black rounded-full opacity-0 spinner-grow animate-pulse"/>
            <span>{txt}</span>
      </div>
    )
}