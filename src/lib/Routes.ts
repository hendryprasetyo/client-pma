const routes = [
  {
    path: '/',
    protected: true,
    unprotected: false,
  },
  {
    path: '/projects',
    protected: true,
    unprotected: false,
  },
  {
    path: '/login',
    protected: false,
    unprotected: true,
  },
  {
    path: '/register',
    protected: false,
    unprotected: true,
  },
]

export default routes
