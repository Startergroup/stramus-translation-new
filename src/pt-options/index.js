export const inputTextPt = {
  root: ({ props }) => {
    return {
      class: [
        'tw-w-full tw-rounded-md tw-border tw-h-10 tw-px-4 tw-py-2',
        'tw-text-sm 2xl:tw-text-base tw-font-normal tw-text-black dark:tw-text-white',
        'dark:tw-bg-ink/base',
        'placeholder:tw-text-sm placeholder:2xl:tw-text-base placeholder:tw-font-normal placeholder:tw-text-middle-gray dark:placeholder:tw-text-light-gray',
        { 'tw-border-error dark:tw-border-red-500': props.invalid },
        { 'tw-border-light-gray dark:tw-border-ink/base': !props.invalid }
      ]
    }
  }
}
export const textareaPt = {
  root: ({ props }) => {
    return {
      class: [
        'tw-w-full tw-rounded-md tw-border tw-min-h-[120px] tw-resize-none placeholder:tw-text-middle-gray dark:tw-text-white dark:tw-bg-ink/base',
        { 'tw-border-error dark:tw-border-red-500': props.invalid },
        { 'tw-border-light-gray dark:tw-border-ink/base': !props.invalid }
      ]
    }
  }
}
