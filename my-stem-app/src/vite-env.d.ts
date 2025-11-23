/// <reference types="vite/client" />

// CSS modules
declare module '*.css' {
  const content: { [className: string]: string }
  export default content
}

// Images and assets
declare module '*.png' {
  const content: string
  export default content
}

declare module '*.jpg' {
  const content: string
  export default content
}

declare module '*.jpeg' {
  const content: string
  export default content
}

declare module '*.gif' {
  const content: string
  export default content
}

declare module '*.svg' {
  const content: string
  export default content
}