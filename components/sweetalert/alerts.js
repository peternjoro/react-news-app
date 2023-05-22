import Swal from "sweetalert2";

const swalWithCustomButtons = Swal.mixin({
    customClass: {
        confirmButton: 'bg-[#3085d6] p-2 rounded-md text-white outline-none px-3',
        cancelButton: 'bg-[#d33] p-2 ml-3 rounded-md text-white px-3'
    },
    buttonsStyling: false
});

const alertError = (title,text,position='center') => {
    Swal.fire({
    //  icon: 'error',
        position: position,
        title: title,
        text: text,
        showCloseButton: true,
        closeButtonHtml: '&times;'
    });
}

const alertProgress = (title,outsideClick=false,position='center') => {
    Swal.fire({
        position: position,
        title: title,
        allowOutsideClick: outsideClick,
        didOpen: () => {
        Swal.showLoading();
        }
    });
}

const closeAlertDialog = () => {
    Swal.close();
}

export { alertError,alertProgress,closeAlertDialog };