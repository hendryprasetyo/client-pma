export type TypeRoutes = {
  path: string
  protected: boolean
  unprotected: boolean
}

export type TResponseApi<T> = {
  status: number | string
  message: string
  data: T | null
  transaction_id: string
}

export type TSubMenuDashboard = {
  id: number
  key: string
  transify_key: string
  icon_url: string
  cta: string
  is_new: boolean
}

export type TMenuDashboard = TSubMenuDashboard & {
  sub_menu_list: TSubMenuDashboard[]
}
