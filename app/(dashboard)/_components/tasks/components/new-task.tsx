import React from 'react'

const NewTask = () => {
  return (
    <div className="max-w-xl mx-auto flex flex-col p-12 space-y-3">
      <div className="flex items-start">
        <div className="flex-1">
          <div className="notion-page-block bg-slate-900 text-slate-200 font-bold text-3xl">
            <h1 className="spellcheck-true placeholder:text-slate-400">Untitled</h1>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewTask