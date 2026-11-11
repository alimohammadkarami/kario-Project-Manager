import { PlusIcon } from "./icons"
export const ProjectsEmpty = () => {
    const empty = "src/assets/empty.svg"
    return (
        <div className="flex flex-col items-center p-8 justify-center h-screen max-h-[70vh] md:h-full w-full gap-4">
            <img src={empty} alt="empty" className="h-1/3" />
                <h1 className="dark:text-white text-lg font-bold">هنوز پروژه ای ثبت نکردی</h1>
                <p className="text-center dark:text-white max-w-md text-sm">
                 اولین پروژه ات رو بساز ، هم تیمی هاتو بهش دعوت کن و بهشون تسک بده 
                <span className="font-bold text-brand-600 dark:text-brand-400" > کاریو </span> بهت کمک میکنه پروژه ات رو بگیری تو مشتت
                </p>
                <button className="flex items-center justify-center gap-2 bg-brand-600 text-white w-auto py-2 px-4 hover:bg-brand-700 transition-all duration-300 cursor-pointer w-au  text-sm rounded-md">
                    <p className=""> ایجاد پروژه جدید</p>
                    <PlusIcon className="w-6 h-6" />
                </button>
        </div>
    )
}