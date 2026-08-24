"use client"

import CustomCard from "@/components/CustomCard"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CustomiseImages from "@/src/customiseImages"
import { ImagePlus } from "lucide-react";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAssistant } from "@/src/context/AssistantContext";

function Page() {

    const [selectedImg, setSelectedImg] = useState<string | null>(null)
    const [selectedType, setSelectedType] = useState<"default" | "upload" | null>(null)

    const { setAssistantData } = useAssistant()

    const inputImg = useRef<HTMLInputElement>(null)

    const router = useRouter()

    const handleImageChange = (e: any) => {
        const file = e.target.files[0];

        if (file) {
            const reader = new FileReader()

            reader.onloadend = () => {
                setSelectedImg(reader.result as string)
                setSelectedType("upload")
            }

            reader.readAsDataURL(file)
        }
    }

    const handleSelectDefault = (img: string) => {
        setSelectedImg(img)
        setSelectedType("default")
    }

    const handleNext = () => {

        if (selectedImg) {

            setAssistantData({
                image: selectedImg,
                type: selectedType
            })

            router.push("/customize2")
        }
    }

    return (
        <div className='w-full min-h-screen bg-gradient-to-t from-black to-[#020236] py-10 px-4'>

            <h1 className="text-gray-50 flex justify-center text-5xl font-bold pb-8">
                Select Your <span className="ml-2 text-blue-400">Assistant Image</span>
            </h1>

            <div className="w-full max-w-[1200px] mx-auto">

                <div className="flex flex-wrap justify-center gap-6">

                    {CustomiseImages.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => handleSelectDefault(item.image.src)}
                            className={`cursor-pointer rounded-2xl transition-all duration-300 hover:border-gray-50
                            ${selectedType === "default" && selectedImg === item.image.src
                                    ? "border-2 border-gray-50 scale-105"
                                    : "border-2 border-transparent"
                                }`}
                        >
                            <CustomCard image={item.image} />
                        </div>
                    ))}

                    {/* Upload Box */}
                    <div
                        onClick={() => inputImg.current?.click()}
                        className={`w-[200px] h-[300px] bg-[#020220] border-2 rounded-2xl
                        overflow-hidden cursor-pointer flex flex-col items-center justify-center gap-3
                        transition-all duration-300 group hover:border-gray-50
                        ${selectedType === "upload"
                                ? "border-gray-50 scale-105"
                                : "border-blue-500/40"
                            }`}
                    >

                        {selectedType === "upload" && selectedImg ? (
                            <img
                                src={selectedImg}
                                alt="Uploaded"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-all">
                                <ImagePlus className="text-blue-400 w-6 h-6" />
                            </div>
                        )}

                        <Input
                            type="file"
                            accept="image/*"
                            ref={inputImg}
                            hidden
                            onChange={handleImageChange}
                        />

                    </div>

                </div>

                {/* Next Button */}
                {selectedImg && (
                    <div className="flex justify-center mt-10">
                        <Button
                            onClick={handleNext}
                            className="bg-gray-50 text-black px-8 py-2"
                        >
                            Next
                        </Button>
                    </div>
                )}

            </div>

        </div>
    )
}

export default Page