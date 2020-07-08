export default interface ICreateOrderDTO {
  recipient_id: string;
  courier_id: string;
  product: string;
  start_date: Date;
}
