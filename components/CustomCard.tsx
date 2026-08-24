import { Card } from "@/components/ui/card"
import Image, { StaticImageData } from "next/image"

type Props = {
  image: StaticImageData
}

function CustomCard({ image }: Props) {
  return (
    <Card className="w-[200px] h-[300px] bg-[#030326] border-2 border-blue-600/30
    rounded-2xl overflow-hidden relative cursor-pointer ">

      <Image
        src={image}
        alt="image"
        fill
        className="object-cover"
      />

    </Card>
  )
}

export default CustomCard