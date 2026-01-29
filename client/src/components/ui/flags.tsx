import * as React from "react"

export const FlagGE = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        {...props}
    >
        <path fill="#fff" d="M0 0h512v512H0z" />
        <path fill="#f00" d="M225 0h62v512h-62z" />
        <path fill="#f00" d="M0 225h512v62H0z" />
        <g fill="#f00">
            <path d="M75 75v48h48V75H75zm64-16v80H59V59h80zM389 75v48h48V75h-48zm64-16v80h-80V59h80zM75 389v48h48v-48H75zm64-16v80H59v-80h80zM389 389v48h48v-48h-48zm64-16v80h-80v-80h80z" />
        </g>
    </svg>
)

export const FlagUS = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        {...props}
    >
        <path fill="#bd3d44" d="M0 0h512v512H0z" />
        <path stroke="#fff" strokeWidth="37" d="M0 55h512M0 129h512M0 203h512M0 277h512M0 351h512M0 425h512M0 499h512" />
        <path fill="#192f5d" d="M0 0h256v277H0z" />
        <marker id="a" markerHeight="30" markerWidth="30">
            <path fill="#fff" d="m15 0 9 29L0 11h30L6 29z" />
        </marker>
        <path fill="#fff" d="m32 28 41-11-20 40 40-19-42-8 32-29M32 99l41-11-20 40 40-19-42-8 32-29M32 170l41-11-20 40 40-19-42-8 32-29M32 241l41-11-20 40 40-19-42-8 32-29M96 61l41-11-20 40 40-19-42-8 32-29M96 132l41-11-20 40 40-19-42-8 32-29M96 203l41-11-20 40 40-19-42-8 32-29M160 28l41-11-20 40 40-19-42-8 32-29M160 99l41-11-20 40 40-19-42-8 32-29M160 170l41-11-20 40 40-19-42-8 32-29M160 241l41-11-20 40 40-19-42-8 32-29M224 61l41-11-20 40 40-19-42-8 32-29M224 132l41-11-20 40 40-19-42-8 32-29M224 203l41-11-20 40 40-19-42-8 32-29" />
    </svg>
)

export const FlagRU = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        {...props}
    >
        <path fill="#fff" d="M0 0h512v512H0z" />
        <path fill="#0039a6" d="M0 170.7h512V512H0z" />
        <path fill="#d52b1e" d="M0 341.3h512V512H0z" />
    </svg>
)

export const FlagUA = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        {...props}
    >
        <path fill="#0057b8" d="M0 0h512v512H0z" />
        <path fill="#ffd700" d="M0 256h512v256H0z" />
    </svg>
)

export const FlagSA = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        {...props}
    >
        <path fill="#006c35" d="M0 0h512v512H0z" />
        {/* Simplified AR text/sword representation for clarity at small sizes */}
        <path fill="#fff" d="M120 360h272v10H120zM140 375l20 20 200-50-200-20z" />
        <path fill="#fff" d="M170 180h20v60h60v20h-60v40h-20v-40h-40v-20h40z" />
    </svg>
)
