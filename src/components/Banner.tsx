
const DiscountBanner = () => {
  return (
      <>
        <div className="flex flex-col text-sm font-medium text-black">
          <div className="flex flex-col justify-center items-center px-16 py-2.5 w-full bg-zinc-100 max-md:px-5 max-md:max-w-full">
            <div className="flex gap-6 items-start max-w-full w-[290px]">
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/0d0e43c6157dac81b4659d4a258ab52a17e6f73251e43b1bd0dd27e644dbdd6e?placeholderIfAbsent=true&apiKey=686ff5188c7041aab3e5ffcf40773996"
                className="object-contain shrink-0 w-4 aspect-square"
              />
              <div className="grow shrink self-stretch w-[211px]">
                Get 10% off on business sign up
              </div>
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/ff3effd7635170030964f3361bea79472b59f0f6634371170e446c93b7552c9e?placeholderIfAbsent=true&apiKey=686ff5188c7041aab3e5ffcf40773996"
                className="object-contain shrink-0 w-4 aspect-square"
              />
            </div>
          </div>
        </div>
      </>
  )
}

export default DiscountBanner