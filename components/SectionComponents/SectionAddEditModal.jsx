import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'

export default function SectionAddEditModal({ isOpen, setIsOpen, templateData, isEdit }) {
    console.log('templateData', templateData)
    return (
        <Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={() => setIsOpen(false)}>
            <div className="fixed inset-0 z-10 backdrop-blur-xs bg-black/50 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4">
                    <DialogPanel
                        transition
                        className="w-full max-w-md rounded-xl bg-white p-6 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
                    >
                        <DialogTitle as="h3" className="text-base/7 font-semibold text-black">
                            {isEdit ? 'Edit' : 'Add'} {templateData?.name} settings
                        </DialogTitle>
                        <div className="mt-2 text-sm/6 text-black/50">
                            <input type="text" value={templateData?.name} />
                        </div>
                        <div className="mt-4">
                            <Button
                                className="inline-flex items-center gap-2 rounded-md bg-gray-700 px-3 py-1.5 text-sm/6 font-semibold text-black shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700"
                                onClick={() => setIsOpen(false)}
                            >
                                Got it, thanks!
                            </Button>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    )
}
