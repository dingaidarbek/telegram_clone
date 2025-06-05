import { useState, useEffect } from 'react'
import { storage } from '../utils/storage'

interface CachedAvatarProps {
    src: string
    alt: string
    className?: string
}

function CachedAvatar({ src, alt, className = '' }: CachedAvatarProps) {
    const [cachedSrc, setCachedSrc] = useState<string>(src)

    useEffect(() => {
        const loadCachedAvatar = async () => {
            const cachedUrl = await storage.cacheAvatar(src)
            setCachedSrc(cachedUrl)
        }

        loadCachedAvatar()
    }, [src])

    return (
        <img
            src={cachedSrc}
            alt={alt}
            className={className}
            onError={() => setCachedSrc(src)} // Fallback to original URL if cached version fails
        />
    )
}

export default CachedAvatar 