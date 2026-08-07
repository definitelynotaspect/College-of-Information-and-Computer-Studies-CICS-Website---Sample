const DATABASE_NAME = 'cics_content_images'
const STORE_NAME = 'images'

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, 1)
    request.onupgradeneeded = () => request.result.createObjectStore(STORE_NAME)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function saveContentImage(key, file) {
  const database = await openDatabase()
  await new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readwrite')
    transaction.objectStore(STORE_NAME).put(file, key)
    transaction.oncomplete = resolve
    transaction.onerror = () => reject(transaction.error)
    transaction.onabort = () => reject(transaction.error)
  })
  database.close()
}

export async function getContentImageUrl(key) {
  if (!key) return null
  const database = await openDatabase()
  const storedImage = await new Promise((resolve, reject) => {
    const request = database.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).get(key)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
  database.close()
  return storedImage ? URL.createObjectURL(storedImage) : null
}
