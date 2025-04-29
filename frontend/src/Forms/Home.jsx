import { useState } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";
import { useAlert } from "../context/AlertContext";
import BackNav from "../components/BackNav";

const HomeForm = () => {
  let navigate = useNavigate();
  const { state } = useLocation();
  const data = state || {};
  const { showAlert } = useAlert();
  const [homeImage, setHomeImage] = useState("");
  const [file, setFile] = useState("");

  const [formData, setFormData] = useState(
    data.data?.map((page) => {
      let pageData = {};

      if (page.page_name === "home") {
        pageData = {
          image: page.page_data.image || "",
          heading: page.page_data.heading || "",
          subHeading: page.page_data.subHeading || "",
          buttonText: page.page_data.buttonText || "",
        };
      } else if (page.page_name === "about") {
        pageData = {
          title: page.page_data.title || "",
          description: page.page_data.description || "",
        };
      } else if (page.page_name === "contact") {
        pageData = {
          name: page.page_data.name || "",
          email: page.page_data.email || "",
          phone: page.page_data.phone || "",
        };
      } else if (page.page_name === "footer") {
        pageData = {
          cols:
            page.page_data.cols.map((col) => ({
              header: col.header || "",
              footerHeaderLinks: col.footerHeaderLinks || [],
            })) || [],
        };
      }

      return {
        id: page.id,
        page_name: page.page_name,
        page_data: pageData,
      };
    })
  );

  const handleFooterChange = (e, pageId, colIndex, linkIndex) => {
    setFormData((prevData) =>
      prevData.map((page) => {
        if (page.id !== pageId) return page;

        if (colIndex !== undefined && linkIndex !== undefined) {
          return {
            ...page,
            page_data: {
              ...page.page_data,
              cols: page.page_data.cols.map((col, i) =>
                i === colIndex
                  ? {
                      ...col,
                      footerHeaderLinks: col.footerHeaderLinks.map((link, j) =>
                        j === linkIndex ? e.target.value : link
                      ),
                    }
                  : col
              ),
            },
          };
        }

        return {
          ...page,
          page_data: { ...page.page_data, [e.target.name]: e.target.value },
        };
      })
    );
  };

  const handleColsChange = (e, pageId, colIndex) => {
    setFormData((prevData) =>
      prevData.map((page) => {
        if (page.id !== pageId) return page;
        return {
          ...page,
          page_data: {
            ...page.page_data,
            cols: page.page_data.cols.map((col, i) =>
              i === colIndex
                ? {
                    ...col,
                    [e.target.name]: e.target.value,
                  }
                : col
            ),
          },
        };
      })
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataDict = formData.reduce((acc, page) => {
      acc[page.page_name] = {
        page_name: page.page_name,
        page_data: page.page_data,
      };
      return acc;
    }, {});

    try {
      const res = await axiosInstance.put(`/update_page`, formDataDict);

      console.log(res, "reg resp");
      const form = new FormData();

      form.append("image", file);
      console.log("image file", form);
      if (homeImage) {
        const imageUpload = await axiosInstance.put(
          "/upload_image?home=home",
          form,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      }
      showAlert("Details updated successfully!");
      navigate("/home");
    } catch (error) {
      showAlert("Detail not updated.");
      console.log("data not sent back", error);
    }
  };

  const handleFileChange = async (e, id) => {
    e.preventDefault();
    const selectedFile = e.target.files[0];

    console.log("file", selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => setHomeImage(reader.result);
      reader.readAsDataURL(selectedFile);
      setFile(selectedFile);
    }
  };

  const handleChange = (e, id) => {
    const { name, value } = e.target;

    setFormData((prev) =>
      prev.map((page) =>
        page.id === id
          ? {
              ...page,
              page_data: {
                ...page.page_data,
                [name]: value,
              },
            }
          : page
      )
    );
    console.log(formData);
  };

  const addHeader = (e, pageId) => {
    e.preventDefault();
    setFormData((prev) =>
      prev.map((page) => {
        if (page.id === pageId) {
          return {
            ...page,
            page_data: {
              ...page.page_data,
              cols: [
                ...(page.page_data.cols || []),
                { header: "", footerHeaderLinks: [] },
              ],
            },
          };
        }
        return page;
      })
    );
  };

  const addLink = (e, index, pageId) => {
    e.preventDefault();
    setFormData((prev) =>
      prev.map((page) => {
        if (page.id === pageId) {
          const updatedCols = page.page_data.cols.map((col, colIndex) => {
            if (colIndex === index) {
              return {
                ...col,
                footerHeaderLinks: [...col.footerHeaderLinks, ""],
              };
            }
            return col;
          });

          return {
            ...page,
            page_data: { ...page.page_data, cols: updatedCols },
          };
        }
        return page;
      })
    );
  };

  return (
    <div>
      <Outlet />
      <BackNav/>
      <div className="mx-auto max-w-screen-xl px-4 py-30 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg text-center">
          <h1 className="text-2xl font-bold sm:text-3xl">
            Edit WebPage Details
          </h1>
        </div>
        <form
          onSubmit={handleSubmit}
          className="mx-auto mb-0 mt-8 w-3xl space-y-4"
        >
          <div className="home-page-details">
            <h1 className="text-center font-semibold mb-8 py-2 px-4 bg-gray-100">
              Home Page
            </h1>

            {formData?.map(
              (page) =>
                page.page_name == "home" && (
                  <div key={page.id}>
                    <div>
                      <p className="mb-2 font-medium">Background Image</p>
                      <div className="relative mt-2 flex items-center justify-center w-72 h-48 overflow-hidden bg-white   border border-gray-200">
                        <img
                          className="w-fit h-fit"
                          src={
                            !homeImage
                              ? `http://localhost:8000/${page.page_data.image}`
                              : homeImage
                          }
                          alt="alternate-name"
                        ></img>
                      </div>
                    </div>
                    <input
                      className="text-gray-500 text-2xs m-0 mb-8"
                      type="file"
                      id="image"
                      name="image"
                      // value={file}
                      onChange={(e) => {
                        handleFileChange(e, page.id);
                        // handleChange(e, page.id);
                      }}
                    />
                    <div className="flex gap-4 mb-8">
                      <div className="mb-4">
                        <p className="mb-1 text-xs font-semibold">Heading</p>
                        <input
                          type="text"
                          className=" rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                          placeholder="Heading"
                          name="heading"
                          value={page.page_data.heading || ""}
                          onChange={(e) => {
                            handleChange(e, page.id);
                          }}
                        />
                      </div>
                      <div className="mb-4 w-full">
                        <p className="mb-1 text-xs font-semibold">
                          Sub Heading
                        </p>
                        <input
                          type="text"
                          className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                          placeholder="Sub Heading"
                          name="subHeading"
                          value={page.page_data.subHeading || ""}
                          onChange={(e) => {
                            handleChange(e, page.id);
                          }}
                        />
                      </div>
                      <div className="mb-4 w-full">
                        <p className="mb-1 text-xs font-semibold">
                          Button Text
                        </p>
                        <input
                          type="text"
                          className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                          placeholder="Button"
                          name="buttonText"
                          value={page.page_data.buttonText || ""}
                          onChange={(e) => {
                            handleChange(e, page.id);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )
            )}
          </div>

          <div className="about-page-details">
            <h1 className="text-center font-semibold mb-8 py-2 px-4 bg-gray-100">
              About Page
            </h1>

            {formData?.map(
              (page) =>
                page.page_name == "about" && (
                  <div key={page.id}>
                    <div className="mb-6 w-full">
                      <p className="mb-1 text-xs font-semibold">Title</p>
                      <input
                        type="text"
                        className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                        placeholder="Title"
                        name="title"
                        value={page.page_data.title || ""}
                        onChange={(e) => {
                          handleChange(e, page.id);
                        }}
                      />
                    </div>
                    <div className="mb-4 w-full">
                      <p className="mb-1 text-xs font-semibold">Description</p>
                      <textarea
                        type="text"
                        className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                        placeholder="Description"
                        name="description"
                        rows="10"
                        value={page.page_data.description || ""}
                        onChange={(e) => {
                          handleChange(e, page.id);
                        }}
                      />
                    </div>
                  </div>
                )
            )}
          </div>

          <div className="contact-page-details">
            <h1 className="text-center mt-12 font-semibold mb-8 py-2 px-4 bg-gray-100">
              Contact Page
            </h1>

            {formData?.map(
              (page) =>
                page.page_name == "contact" && (
                  <div key={page.id} className="flex gap-4">
                    <div className="mb-4 w-full">
                      <p className="mb-1 text-xs font-semibold">Name</p>
                      <input
                        type="text"
                        className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                        placeholder="Name"
                        name="name"
                        value={page.page_data.name || ""}
                        onChange={(e) => {
                          handleChange(e, page.id);
                        }}
                      />
                    </div>
                    <div className="mb-4 w-full">
                      <p className="mb-1 text-xs font-semibold">Email</p>
                      <input
                        type="text"
                        className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                        placeholder="Email"
                        name="email"
                        value={page.page_data.email}
                        onChange={(e) => {
                          handleChange(e, page.id);
                        }}
                      />
                    </div>
                    <div className="mb-4 w-full">
                      <p className="mb-1 text-xs font-semibold">Phone</p>
                      <input
                        type="text"
                        className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                        placeholder="Phone number"
                        name="phone"
                        value={page.page_data.phone || ""}
                        onChange={(e) => {
                          handleChange(e, page.id);
                        }}
                      />
                    </div>
                  </div>
                )
            )}
          </div>

          <div className="footer-details">
            <h1 className="text-center mt-12 font-semibold mb-8 py-2 px-4 bg-gray-100">
              Footer
            </h1>
            {formData?.map(
              (page) =>
                page.page_name === "footer" && (
                  <div key={page.id}>
                    {page.page_data.cols?.map((col, index) => (
                      <div
                        className="p-4 border border-gray-200 rounded-2xl my-4"
                        key={index}
                      >
                        <div className="mb-8">
                          <p className="mb-1 text-xs font-semibold">Header</p>

                          <input
                            type="text"
                            className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                            placeholder="Header"
                            name="header"
                            value={col.header}
                            onChange={(e) =>
                              handleColsChange(e, page.id, index)
                            }
                          />
                        </div>

                        <div>
                          <p className="mb-1 text-xs font-semibold">Links</p>

                          {col.footerHeaderLinks?.map((link, linkIndex) => (
                            <input
                              type="text"
                              key={linkIndex}
                              value={link}
                              name="col"
                              onChange={(e) =>
                                handleFooterChange(e, page.id, index, linkIndex)
                              }
                              className="w-full mb-2 rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                            />
                          ))}
                        </div>

                        <button
                          className="text-gray-400 bg-gray-100 px-4 py-2 rounded-3xl text-2xs font-medium mt-2 hover:border-2 border-gray-400 hover:text-gray-500"
                          onClick={(e) => addLink(e, index, page.id)}
                        >
                          Add Link<i className="ml-2 fa-solid fa-plus"></i>
                        </button>
                      </div>
                    ))}

                    <button
                      className="text-gray-500 bg-gray-200 px-6 py-2 rounded-3xl text-2xs font-medium mt-2 hover:border-2 border-black hover:text-black"
                      onClick={(e) => addHeader(e, page.id)}
                    >
                      Add Header<i className="ml-2 fa-solid fa-plus"></i>
                    </button>
                  </div>
                )
            )}
          </div>
          <button
            className="px-8 font-semibold py-2 bg-black rounded-3xl text-white hover:border-2 border-black hover:bg-white hover:text-black"
            type="submit"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default HomeForm;
