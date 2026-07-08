import axios from 'axios'
import { API_BASE } from './apiConfig'

/**
 * @returns {Promise<Array<{id:number,name:string,priceUsd:number,description?:string,imageUrl?:string,videoUrl?:string}>>}
 */
export async function getActiveGiftBoxes() {
  const res = await axios.get(`${API_BASE}/api/v1/gift-boxes/active`)
  return Array.isArray(res.data) ? res.data : []
}

/**
 * @returns {Promise<Array<{id:number,name:string,price:number,description?:string,imageUrl?:string,videoUrl?:string}>>}
 */
export async function getActiveGiftCards() {
  const res = await axios.get(`${API_BASE}/api/v1/gift-cards/active`)
  return Array.isArray(res.data) ? res.data : []
}
