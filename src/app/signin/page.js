// 'use client'

// import { useState, useEffect, useRef } from 'react'
// import { useRouter } from 'next/navigation'
// import Link from 'next/link'

// export default function SignInPage() {
//   const router = useRouter()
//   const canvasRef = useRef(null)
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     rememberMe: false
//   })
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState('')
//   const [success, setSuccess] = useState('')
//   const [showPassword, setShowPassword] = useState(false)
//   const [isMobile, setIsMobile] = useState(false)

//   // Check if mobile
//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 640)
//     }
//     checkMobile()
//     window.addEventListener('resize', checkMobile)
//     return () => window.removeEventListener('resize', checkMobile)
//   }, [])

//   // Anime Background Animation
//   useEffect(() => {
//     const canvas = canvasRef.current
//     if (!canvas) return
    
//     const ctx = canvas.getContext('2d', { alpha: false })
//     let particles = []
//     let animationFrameId
    
//     const resizeCanvas = () => {
//       const dpr = window.devicePixelRatio || 1
//       const displayWidth = window.innerWidth
//       const displayHeight = window.innerHeight
      
//       canvas.width = displayWidth * dpr
//       canvas.height = displayHeight * dpr
//       canvas.style.width = `${displayWidth}px`
//       canvas.style.height = `${displayHeight}px`
      
//       ctx.scale(dpr, dpr)
//       createParticles()
//     }

//     const createParticles = () => {
//       const width = window.innerWidth
//       const height = window.innerHeight
//       const particleCount = isMobile ? 40 : 80
//       particles = []
      
//       for (let i = 0; i < particleCount; i++) {
//         particles.push({
//           x: Math.random() * width,
//           y: Math.random() * height,
//           size: Math.random() * 2 + 1,
//           speedX: (Math.random() - 0.5) * 0.3,
//           speedY: (Math.random() - 0.5) * 0.3,
//           opacity: Math.random() * 0.2 + 0.1
//         })
//       }
//     }

//     const drawParticles = () => {
//       const width = window.innerWidth
//       const height = window.innerHeight
      
//       ctx.clearRect(0, 0, width, height)
      
//       const gradient = ctx.createLinearGradient(0, 0, width, height)
//       gradient.addColorStop(0, '#667eea')
//       gradient.addColorStop(0.5, '#764ba2')
//       gradient.addColorStop(1, '#f093fb')
      
//       ctx.fillStyle = gradient
//       ctx.fillRect(0, 0, width, height)

//       particles.forEach(particle => {
//         ctx.beginPath()
//         ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
//         ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`
//         ctx.fill()
        
//         particle.x += particle.speedX
//         particle.y += particle.speedY
        
//         if (particle.x < 0) particle.x = width
//         if (particle.x > width) particle.x = 0
//         if (particle.y < 0) particle.y = height
//         if (particle.y > height) particle.y = 0
//       })
      
//       const lineDistance = isMobile ? 80 : 120
//       particles.forEach((particle1, i) => {
//         particles.slice(i + 1).forEach(particle2 => {
//           const dx = particle1.x - particle2.x
//           const dy = particle1.y - particle2.y
//           const distance = Math.sqrt(dx * dx + dy * dy)
          
//           if (distance < lineDistance) {
//             ctx.beginPath()
//             ctx.strokeStyle = `rgba(255, 255, 255, ${0.15 * (1 - distance / lineDistance)})`
//             ctx.lineWidth = 0.5
//             ctx.moveTo(particle1.x, particle1.y)
//             ctx.lineTo(particle2.x, particle2.y)
//             ctx.stroke()
//           }
//         })
//       })
      
//       animationFrameId = requestAnimationFrame(drawParticles)
//     }

//     resizeCanvas()
//     drawParticles()

//     const handleResize = () => {
//       resizeCanvas()
//     }

//     window.addEventListener('resize', handleResize)

//     return () => {
//       if (animationFrameId) {
//         cancelAnimationFrame(animationFrameId)
//       }
//       window.removeEventListener('resize', handleResize)
//     }
//   }, [isMobile])

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target
//     setFormData({
//       ...formData,
//       [name]: type === 'checkbox' ? checked : value
//     })
//     setError('')
//   }

 



// const handleSubmit = async (e) => {
//     e.preventDefault()
//     setError('')
//     setLoading(true)

//     try {
//       const response = await fetch('http://localhost:5000/api/v1/auth/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         credentials: 'include',
//         body: JSON.stringify({
//           email: formData.email,
//           password: formData.password
//         })
//       })

//       const data = await response.json()
//       console.log('🔍 Login response:', data)

//       if (!response.ok) {
//         throw new Error(data.message || 'Login failed')
//       }

//       // Save token from response body
//       if (data.token) {
//         localStorage.setItem('token', data.token)
//         console.log('✅ Token saved')
//       } else {
//         console.warn('⚠️ No token in response!')
//       }

//       // Save user data
//       const userData = data.data?.user || data.user
//       if (userData) {
//         localStorage.setItem('userData', JSON.stringify(userData))
//         localStorage.setItem('isAuthenticated', 'true')
//         console.log('✅ Auth saved for:', userData.email)
//       } else {
//         console.warn('⚠️ No user data in response!')
//       }

//       // Store remember me preference
//       if (formData.rememberMe) {
//         localStorage.setItem('rememberMe', 'true')
//       }

//       // Check what was saved
//       console.log('📦 localStorage after login:', {
//         isAuthenticated: localStorage.getItem('isAuthenticated'),
//         hasToken: !!localStorage.getItem('token'),
//         tokenPreview: localStorage.getItem('token')?.substring(0, 20) + '...',
//         hasUserData: !!localStorage.getItem('userData')
//       })

//       // Hard redirect
//       window.location.href = '/'

//     } catch (err) {
//       console.error('❌ Login error:', err)
//       setError(err.message || 'Invalid email or password')
//       setLoading(false)
//     }
//   }
  
    

// if (!response.ok) {
//   throw new Error(data.message || 'Login failed')
// }

// // ✅ Save token from response body
// if (data.token) {
//   localStorage.setItem('token', data.token);
// }

// const userData = data.data?.user || data.user;
// if (userData) {
//   localStorage.setItem('userData', JSON.stringify(userData))
//   localStorage.setItem('isAuthenticated', 'true')
// }

// window.location.href = '/'


//     } catch (err) {
//       setError(err.message || 'Invalid email or password')
//       setLoading(false)
//     }
//   }

//   return (
//     <>
//       <canvas
//         ref={canvasRef}
//         className="fixed top-0 left-0 w-full h-full -z-10"
//         style={{ imageRendering: 'crisp-edges' }}
//       />
      
//       <div className="relative min-h-screen w-full flex items-center justify-center p-3 sm:p-4">
//         <div className="w-full max-w-[380px] sm:max-w-[400px] my-auto">
//           <div className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl p-4 sm:p-6 max-h-[85vh] sm:max-h-[80vh] overflow-y-auto scrollbar-hide">
            
//             <div className="text-center mb-4 sm:mb-5">
//               <div className="mb-3">
//                 <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
//                   <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                   </svg>
//                 </div>
//               </div>
//               <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">
//                 Welcome Back
//               </h1>
//               <p className="text-xs sm:text-sm text-gray-500">
//                 Sign in to your account
//               </p>
//             </div>

//             {error && (
//               <div className="mb-3 p-2.5 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs sm:text-sm animate-fade-in">
//                 <div className="flex items-center gap-2">
//                   <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                   <span>{error}</span>
//                 </div>
//               </div>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
//               <div>
//                 <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">
//                   Email Address
//                 </label>
//                 <div className="relative">
//                   <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                     </svg>
//                   </div>
//                   <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     required
//                     autoComplete="email"
//                     className="w-full pl-9 sm:pl-10 pr-3 py-2 sm:py-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
//                     placeholder="john@example.com"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">
//                   Password
//                 </label>
//                 <div className="relative">
//                   <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                     </svg>
//                   </div>
//                   <input
//                     type={showPassword ? 'text' : 'password'}
//                     name="password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     required
//                     autoComplete="current-password"
//                     className="text-black w-full pl-9 sm:pl-10 pr-10 py-2 sm:py-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
//                     placeholder="••••••••"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className=" absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
//                   >
//                     {showPassword ? (
//                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                       </svg>
//                     ) : (
//                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
//                       </svg>
//                     )}
//                   </button>
//                 </div>
//               </div>

//               <div className="flex items-center justify-between">
//                 <label className="flex items-center cursor-pointer">
//                   <input
//                     type="checkbox"
//                     name="rememberMe"
//                     checked={formData.rememberMe}
//                     onChange={handleChange}
//                     className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                   />
//                   <span className="ml-2 text-xs sm:text-sm text-gray-700">
//                     Remember me
//                   </span>
//                 </label>
//                 <Link 
//                   href="/forgot-password" 
//                   className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 hover:underline"
//                 >
//                   Forgot Password?
//                 </Link>
//               </div>

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 sm:py-2.5 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm shadow-md hover:shadow-lg"
//               >
//                 {loading ? (
//                   <>
//                     <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                     <span>Signing in...</span>
//                   </>
//                 ) : (
//                   <>
//                     <span>Sign In</span>
//                     <span>→</span>
//                   </>
//                 )}
//               </button>
//             </form>

//             <div className="relative my-4 sm:my-5">
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t border-gray-300"></div>
//               </div>
//               <div className="relative flex justify-center">
//                 <span className="px-2 sm:px-3 bg-white text-gray-500 text-xs">Or continue with</span>
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-2">
//               <button className="flex items-center justify-center space-x-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors">
//                 <svg className="w-4 h-4" viewBox="0 0 24 24">
//                   <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
//                   <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
//                   <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
//                   <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
//                 </svg>
//                 <span className="text-xs font-medium text-gray-700">Google</span>
//               </button>
              
//               <button className="flex items-center justify-center space-x-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors">
//                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
//                   <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.205 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
//                 </svg>
//                 <span className="text-xs font-medium text-gray-700">GitHub</span>
//               </button>
//             </div>

//             <div className="mt-4 sm:mt-5 text-center">
//               <p className="text-xs text-gray-600">
//                 Don&apos;t have an account?{' '}
//                 <Link 
//                   href="/signup" 
//                   className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
//                 >
//                   Sign up
//                 </Link>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       <style jsx global>{`
//         .scrollbar-hide::-webkit-scrollbar {
//           display: none;
//         }
        
//         .scrollbar-hide {
//           -ms-overflow-style: none;
//           scrollbar-width: none;
//         }
        
//         @keyframes fade-in {
//           from {
//             opacity: 0;
//             transform: translateY(-10px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
        
//         .animate-fade-in {
//           animation: fade-in 0.3s ease-out;
//         }
        
//         @media (max-width: 640px) {
//           input, button {
//             font-size: 16px !important;
//           }
//         }
//       `}</style>
//     </>
//   )
// }

























'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignInPage() {
  const router = useRouter()
  const canvasRef = useRef(null)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: false })
    let particles = []
    let animationFrameId

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.scale(dpr, dpr)
      createParticles()
    }

    const createParticles = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const count = isMobile ? 40 : 80
      particles = []
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 2 + 1,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.2 + 0.1
        })
      }
    }

    const drawParticles = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      ctx.clearRect(0, 0, width, height)
      const gradient = ctx.createLinearGradient(0, 0, width, height)
      gradient.addColorStop(0, '#667eea')
      gradient.addColorStop(0.5, '#764ba2')
      gradient.addColorStop(1, '#f093fb')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      particles.forEach(p => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`
        ctx.fill()
        p.x += p.speedX
        p.y += p.speedY
        if (p.x < 0) p.x = width
        if (p.x > width) p.x = 0
        if (p.y < 0) p.y = height
        if (p.y > height) p.y = 0
      })

      const lineDistance = isMobile ? 80 : 120
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          if (distance < lineDistance) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.15 * (1 - distance / lineDistance)})`
            ctx.lineWidth = 0.5
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        })
      })
      animationFrameId = requestAnimationFrame(drawParticles)
    }

    resizeCanvas()
    drawParticles()
    window.addEventListener('resize', resizeCanvas)
    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [isMobile])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('http://localhost:5000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      })

      const data = await response.json()
      console.log('🔍 Login response:', data)

      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }

      // Save token
      if (data.token) {
        localStorage.setItem('token', data.token)
        console.log('✅ Token saved')
      }

      // Save refresh token
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken)
      }

      // Save user data
      const userData = data.data?.user || data.user
      if (userData) {
        localStorage.setItem('userData', JSON.stringify(userData))
        localStorage.setItem('isAuthenticated', 'true')
        console.log('✅ Auth saved for:', userData.email)
      }

      if (formData.rememberMe) {
        localStorage.setItem('rememberMe', 'true')
      }

      console.log('📦 localStorage:', {
        isAuthenticated: localStorage.getItem('isAuthenticated'),
        hasToken: !!localStorage.getItem('token'),
      })

      window.location.href = '/'

    } catch (err) {
      console.error('❌ Login error:', err)
      setError(err.message || 'Invalid email or password')
      setLoading(false)
    }
  }

  return (
    <>
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" />
      <div className="relative min-h-screen w-full flex items-center justify-center p-3 sm:p-4">
        <div className="w-full max-w-[380px] sm:max-w-[400px] my-auto">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl p-4 sm:p-6 max-h-[85vh] sm:max-h-[80vh] overflow-y-auto scrollbar-hide">
            <div className="text-center mb-4 sm:mb-5">
              <div className="mb-3">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">Welcome Back</h1>
              <p className="text-xs sm:text-sm text-gray-500">Sign in to your account</p>
            </div>

            {error && (
              <div className="mb-3 p-2.5 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">Email Address</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required autoComplete="email" className="w-full pl-9 sm:pl-10 pr-3 py-2 sm:py-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200" placeholder="john@example.com" />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">Password</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} required autoComplete="current-password" className="text-black w-full pl-9 sm:pl-10 pr-10 py-2 sm:py-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200" placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" name="rememberMe" checked={formData.rememberMe} onChange={handleChange} className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                  <span className="ml-2 text-xs sm:text-sm text-gray-700">Remember me</span>
                </label>
                <Link href="/forgot-password" className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 hover:underline">Forgot Password?</Link>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 sm:py-2.5 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm shadow-md hover:shadow-lg">
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <span>→</span>
                  </>
                )}
              </button>
            </form>

            <div className="relative my-4 sm:my-5">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div>
              <div className="relative flex justify-center"><span className="px-2 sm:px-3 bg-white text-gray-500 text-xs">Or continue with</span></div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button className="flex items-center justify-center space-x-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                <span className="text-xs font-medium text-gray-700">Google</span>
              </button>
              <button className="flex items-center justify-center space-x-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.205 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                <span className="text-xs font-medium text-gray-700">GitHub</span>
              </button>
            </div>

            <div className="mt-4 sm:mt-5 text-center">
              <p className="text-xs text-gray-600">
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors">Sign up</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}