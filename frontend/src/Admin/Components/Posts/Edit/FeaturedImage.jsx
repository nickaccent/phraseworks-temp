import { Dialog, Transition } from '@headlessui/react';
import { APIConnectorContext } from '../../../../Contexts/APIConnectorContext.jsx';
import { XMarkIcon } from '@heroicons/react/24/outline';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import { APIGetFiles } from '../../../../API/APIMedia';
import MediaBoxView from './MediaBoxView';
import MediaSearch from './MediaSearch.jsx';
import MediaPagination from './MediaPagination.jsx';

const FeaturedImage = ({ featuredImage, setFeaturedImageId }) => {
  const { loginPassword } = useContext(APIConnectorContext);
  const [sliderMediaOpen, setSliderMediaOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [type, setType] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [thumbnail, setThumbnail] = useState(1);
  const [totalFiles, setTotalFiles] = useState(0);
  const perPage = 20;

  const HandleClose = () => {};

  const fetchData = async () => {
    const data = await APIGetFiles(loginPassword, (page - 1) * perPage, type, search);
    if (data.status == 200) {
      const tmpFiles = [];
      setTotalFiles(data.data.getMediaFiles.total);
      data.data.getMediaFiles.files.map((file) => {
        const url = `http://localhost:8787/r2/${file.filename}`;
        const newData = {
          id: file.id,
          filename: file.filename,
          mimetype: file.mimetype,
          url: url,
          author: file.author,
          date: file.date,
          attachment_metadata: JSON.parse(file.attachment_metadata),
        };
        tmpFiles.push(newData);
      });
      setFiles(tmpFiles);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, type, search]);

  useEffect(() => {
    if (featuredImage != null) {
      const thumb =
        featuredImage?.attachment_metadata?.sizes?.find((item) => item.slug === 'thumbnail')
          ?.file || featuredImage?.filename;
      setThumbnail(thumb);
    }
  }, [featuredImage]);

  return (
    <>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full mt-8 p-4">
        <h3 className="font-bold text-lg">Featured Image</h3>
        <hr className="my-4" />
        {featuredImage != null && (
          <img
            src={`http://localhost:8787/r2/${thumbnail}`}
            className="w-full h-auto object-cover"
            alt={featuredImage?.post_title || featuredImage?.filename}
          />
        )}

        <div className="flex flex-row justify-start">
          <button
            type="button"
            className="flex items-center justify-center  py-2 text-sm font-medium text-blue-700 hover:text-blue-800 "
            onClick={() => setSliderMediaOpen(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 mr-2"
            >
              <path
                fillRule="evenodd"
                d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
                clipRule="evenodd"
              />
            </svg>
            Set Featured Image
          </button>
        </div>
      </div>
      <Transition.Root show={sliderMediaOpen} as={Fragment}>
        <Dialog as="div" className="relative z-30" onClose={HandleClose}>
          <div className="fixed inset-0" />

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-7xl">
                    <div
                      className={`bg-white flex h-full flex-col overflow-y-scroll  py-6 shadow-2xl`}
                    >
                      <div className="px-4 sm:px-6">
                        <div className="relative mt-6 flex-1 px-4 sm:px-6">
                          <div className="flex items-start justify-start">
                            <div className="w-full">
                              <div className="flex items-start justify-between w-full pt-3">
                                <Dialog.Title
                                  className={`text-gray-900 text-base font-semibold leading-6`}
                                >
                                  Media
                                </Dialog.Title>
                                <div className="ml-3 flex h-7 items-center">
                                  <button
                                    type="button"
                                    className={`bg-white relative rounded-md text-gray-400 hover:text-gray-500`}
                                    onClick={() => {
                                      setSliderMediaOpen(false);
                                    }}
                                  >
                                    <span className="absolute -inset-2.5" />
                                    <span className="sr-only">Close panel</span>
                                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                  </button>
                                </div>
                              </div>
                              <div className="mt-4">
                                <MediaSearch search={search} setSearch={setSearch} />
                                <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full mt-8">
                                  <MediaBoxView
                                    files={files}
                                    setFeaturedImageId={setFeaturedImageId}
                                    setSliderMediaOpen={setSliderMediaOpen}
                                  />
                                  <MediaPagination
                                    totalFiles={totalFiles}
                                    page={page}
                                    perPage={perPage}
                                    setPage={setPage}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export default FeaturedImage;
