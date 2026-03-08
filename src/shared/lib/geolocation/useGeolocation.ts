import { useState, useEffect } from 'react'

type GeolocationState = {
  latitude: number | null
  longitude: number | null
  error: string | null
  loading: boolean
}

/**
 * Хук для получения геопозиции пользователя через браузерный API
 */
export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: false,
  })

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({
        latitude: null,
        longitude: null,
        error: 'Geolocation is not supported',
        loading: false,
      })
      return
    }

    setState(prev => ({ ...prev, loading: true }))

    navigator.geolocation.getCurrentPosition(
      position => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          loading: false,
        })
      },
      error => {
        setState({
          latitude: null,
          longitude: null,
          error: error.message,
          loading: false,
        })
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 3600000, // 1 час кэш
      }
    )
  }, [])

  return state
}

/**
 * Определяет ближайший город из справочника по координатам
 */
export function findNearestCity(
  latitude: number,
  longitude: number,
  cities: Array<{ cityRu: string; latitude: string; longitude: string }>
): string | null {
  let nearestCity: string | null = null
  let minDistance = Infinity

  cities.forEach(cityData => {
    const cityLat = parseFloat(cityData.latitude)
    const cityLon = parseFloat(cityData.longitude)

    const latDiff = latitude - cityLat
    const lonDiff = longitude - cityLon

    const distance = Math.sqrt(latDiff * latDiff + lonDiff * lonDiff)

    if (distance < minDistance) {
      minDistance = distance
      nearestCity = cityData.cityRu
    }
  })

  if (minDistance > 5) {
    return null
  }

  return nearestCity
}
