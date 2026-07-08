"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface CustomButtonProps {
    text: string;
    hyperlink: string;
    background: string;
}

const CustomButton = ({ text, hyperlink, background }: CustomButtonProps) => {

    // console.log('hyperlink: ', hyperlink);

    return (
        <Link
            href={hyperlink}
            className={`group w-full flex items-center justify-center p-2 rounded-full cursor-pointer gap-2 select-none text-center
            transition-all duration-300 ease-in-out hover:scale-[1.02] active:scale-95 ${background}`}>
            <span>{text}</span>

            <span className="transform transition-transform duration-300 group-hover:translate-x-1">
                <ArrowRight size={18} />
            </span>
        </Link>
    );
};

export default CustomButton;
