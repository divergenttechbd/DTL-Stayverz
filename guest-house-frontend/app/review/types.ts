
export interface IReview {
  rating: number
  id?: number
  created_at: string
  review: string
  review_by: {
    image: string
    full_name: string
  }
  listing: {
    title: string
    cover_photo: string
    unique_id: string
  }
}
