export interface IQa {
    id?: number;
    question: string;
    answer: string;
}

export interface IQaCards {
    id?: number;
    text: string;
    cards: IQa[]
}