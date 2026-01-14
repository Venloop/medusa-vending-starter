import { useEffect, DependencyList, EffectCallback } from "react"

/**
 * Hook that provides AbortController and helper methods for async operations
 * Returns object with signal and utility functions
 *
 * @example
 * useAbortableEffect(({ signal, isAborted }) => {
 *   const fetchData = async () => {
 *     try {
 *       const response = await fetch('/api/data', { signal })
 *       const data = await response.json()
 *       if (!isAborted()) {
 *         setState(data)
 *       }
 *     } catch (error) {
 *       if (error.name !== 'AbortError') {
 *         console.error('Fetch failed:', error)
 *       }
 *     }
 *   }
 *   fetchData()
 * }, [])
 */
export function useAbortableEffect(
  effect: (helpers: {
    signal: AbortSignal
    isAborted: () => boolean
    throwIfAborted: () => void
  }) => ReturnType<EffectCallback>,
  deps?: DependencyList
): void {
  useEffect(() => {
    const abortController = new AbortController()
    const { signal } = abortController

    const helpers = {
      signal,
      isAborted: () => signal.aborted,
      throwIfAborted: () => {
        if (signal.aborted) {
          throw new DOMException("Aborted", "AbortError")
        }
      },
    }

    const cleanup = effect(helpers)

    return () => {
      abortController.abort()
      if (cleanup) {
        cleanup()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
