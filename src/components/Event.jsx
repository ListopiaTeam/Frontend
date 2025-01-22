import React from "react";

const Event = () => {
    return (
        <section className="relative bg-[url('banner.jpg')] bg-cover bg-center bg-no-repeat">

            <div
                className="absolute inset-0 bg-gray-900/30 sm:bg-gradient-to-r sm:from-gray-900/90 sm:to-gray-900/15 bg-gradient-to-b from-gray-900/90 to-gray-900/15"
            ></div>

            <div
                className="relative mx-auto max-w-screen-xl px-4 py-32 sm:px-6 lg:flex lg:h-screen lg:items-center lg:px-8"
            >
                <div className="max-w-xl text-center sm:text-left">
                    <h1 className="text-3xl font-extrabold text-white sm:text-5xl">
                        Listopia
                        <strong className="block font-extrabold text-rose-600">
                            Be the best
                        </strong>
                    </h1>

                    <p className="mt-4 max-w-lg text-white sm:text-xl">
                        Submit your list to be the winner for the List Creating event and be on the leaderboard!
                    </p>

                    <div className="mt-8 flex flex-wrap gap-4 text-center">
                        <a
                            href="#"
                            className="block w-full rounded bg-rose-600 px-12 py-3 text-sm font-medium text-white shadow hover:bg-rose-700 focus:outline-none focus:ring active:bg-rose-500 sm:w-auto"
                        >
                            Submit List
                        </a>

                        <a
                            href="#"
                            className="block w-full rounded bg-white px-12 py-3 text-sm font-medium text-rose-600 shadow hover:text-rose-700 focus:outline-none focus:ring active:text-rose-500 sm:w-auto"
                        >
                            Learn More
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Event;
