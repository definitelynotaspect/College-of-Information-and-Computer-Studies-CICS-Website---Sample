const DATABASE_NAME = 'cics_curriculum_files'
const STORE_NAME = 'files'

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, 1)
    request.onupgradeneeded = () => request.result.createObjectStore(STORE_NAME)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function saveCurriculumFile(key, file) {
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

export async function getCurriculumFileUrl(file) {
  if (!file) return null
  if (file.data) return file.data
  if (!file.storageKey) return null

  const database = await openDatabase()
  const storedFile = await new Promise((resolve, reject) => {
    const request = database.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).get(file.storageKey)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
  database.close()
  if (typeof storedFile === 'string') return storedFile
  return storedFile ? URL.createObjectURL(storedFile) : null
}
